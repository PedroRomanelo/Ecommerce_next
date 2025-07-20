import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs"
import Link from "next/link"
function Navbar() {
    return (
                <nav className='fixed top-0 w-full flex items-center py-2 px-8 justify-between z-50 bg-slate-800 text-gray-300'>
          <Link 
          href="/"
          className='uppercase font-bold text-md h-12 flex items-center'
          >
          Kamizetaz
          </Link>
          <div className='flex items-center gap-8'>
            <SignedIn>
                <UserButton></UserButton>
            </SignedIn>
            <SignedOut>
                <SignInButton mode='modal'>
                <button className="uppercase rounded-md cursor-pointer border border-gray-400 px-3 py-2">
                    fazer login
                </button>
                </SignInButton>
            </SignedOut>
          </div>
        </nav>
    )
}

export default Navbar