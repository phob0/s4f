import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0 text-purple-200"
            href="#"
            rel="noopener noreferrer"
          >
            Connect your wallet{' '}
            <Image
              src="/bitcoin.svg"
              alt="Wallet Logo"
              className="dark:invert"
              width={50}
              height={50}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/s4f-classic.png"
          alt="S4F Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-5 lg:text-left">
        <a
          href="#"
          className="group rounded-lg border border-transparent mr-4 px-5 py-4 bg-purple-600 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
            PIPERA{' '}
          </h2>
          <h4 className={`${inter.className} mb-3 text-2xl`}>
            Metaverse Gym{' '}
          </h4>
          <button 
            className={`${inter.className} group rounded-2xl h-12 w-48 bg-green-500 font-bold text-lg text-white relative overflow-hidden`}>
              OPEN
              <div class="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-2xl">
              </div>
          </button>
        </a>

        <a
          href="#"
          className="group rounded-lg border border-transparent mr-4 px-5 py-4 bg-purple-600 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
            CLUJ{' '}
          </h2>
          <h4 className={`${inter.className} mb-3 text-2xl`}>
            Metaverse Gym{' '}
          </h4>
          <button 
            className={`${inter.className} group rounded-2xl h-12 w-48 bg-green-500 font-bold text-lg text-white relative overflow-hidden`}>
              OPEN
              <div class="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-2xl">
              </div>
          </button>
        </a>

        <a
          href="#"
          className="group rounded-lg border border-transparent mr-4 px-5 py-4 bg-purple-600 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
            IASI{' '}
          </h2>
          <h4 className={`${inter.className} mb-3 text-2xl`}>
            Metaverse Gym{' '}
          </h4>
          <button 
            className={`${inter.className} group rounded-2xl h-12 w-48 bg-red-500 font-bold text-lg text-white relative overflow-hidden`}>
              COMMING SOON
              <div class="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-2xl">
              </div>
          </button>
        </a>

        <a
          href="#"
          className="group rounded-lg border border-transparent mr-4 px-5 py-4 bg-purple-600 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
            DUBAI{' '}
          </h2>
          <h4 className={`${inter.className} mb-3 text-2xl`}>
            Metaverse Gym{' '}
          </h4>
          <button 
            className={`${inter.className} group rounded-2xl h-12 w-48 bg-red-500 font-bold text-lg text-white relative overflow-hidden`}>
              COMMING SOON
              <div class="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-2xl">
              </div>
          </button>
        </a>

        <a
          href="#"
          className="group rounded-lg border border-transparent px-5 py-4 bg-purple-600 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
            PARIS{' '}
          </h2>
          <h4 className={`${inter.className} mb-3 text-2xl`}>
            Metaverse Gym{' '}
          </h4>
          <button 
            className={`${inter.className} group rounded-2xl h-12 w-48 bg-red-500 font-bold text-lg text-white relative overflow-hidden`}>
              COMMING SOON
              <div class="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-2xl">
              </div>
          </button>
        </a>
      </div>
    </main>
  )
}
