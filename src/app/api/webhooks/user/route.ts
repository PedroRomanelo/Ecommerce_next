import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { IncomingHttpHeaders} from "http";
import { Webhook, WebhookRequiredHeaders } from 'svix';

// Pega o secret do webhook do Clerk das variáveis de ambiente
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

// Tipos de eventos que o Clerk pode enviar
type EventType = 'user.created' | 'user.updated' | '*';

// Estrutura do evento recebido do webhook
type Event = {
    data: EventDataType;
    object: 'event';
    type: EventType;
};

// Dados do usuário enviados pelo Clerk
type EventDataType = {
    id: string;
    first_name: string;
    last_name: string;
    email_addresses: EmailAddressType[];
    primary_email_address_id: string;
    attributes: Record<string, string | number>;
};

// Estrutura dos endereços de email
type EmailAddressType = {
    id: string;
    email_address: string;
};

async function handler(request: Request) {
    // Extrai o payload JSON da requisição
    const payload = await request.json();
    
    // Pega os headers necessários para verificação do webhook
    const headersList = await headers();
    const heads = {
        'svix-id': headersList.get('svix-id'),
        'svix-timestamp': headersList.get('svix-timestamp'),
        'svix-signature': headersList.get('svix-signature'),
    };
    
    // Inicializa o webhook com o secret
    const wh = new Webhook(webhookSecret);
    let evt: Event | null = null;

    try {
        // Verifica se o webhook é válido e autêntico
        evt = await wh.verify(
            JSON.stringify(payload),
            heads as IncomingHttpHeaders & WebhookRequiredHeaders
        ) as Event;
    } catch (err) {
        // Se a verificação falhar, retorna erro 400
        console.error((err as Error).message);
        return NextResponse.json({}, { status: 400 });
    }

    const eventType: EventType = evt.type;

    // Processa apenas eventos de criação ou atualização de usuário
    if (evt.type === 'user.created' || eventType === 'user.updated') {
        const {
            id,
            first_name,
            last_name,
            email_addresses,
            primary_email_address_id,
            ...attributes // Pega todos os outros atributos
        } = evt.data;

        // Atualiza ou cria o usuário no banco de dados
        await prisma.user.upsert({
            where: {
                externalId: id as string, // Usa o ID do Clerk como chave externa
            },
            create: {
                externalId: id as string,
                attributes // Salva os atributos adicionais
            },
            update: {
                attributes // Atualiza apenas os atributos
            }
        });
    }
    
    // Retorna sucesso
    return NextResponse.json({}, { status: 200 });
}

// Exporta o handler para todos os métodos HTTP
export const GET = handler;
export const POST = handler;
export const PUT = handler;