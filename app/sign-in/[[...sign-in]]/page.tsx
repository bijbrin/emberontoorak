import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-obsidian flex items-center justify-center py-20 px-4">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center mb-2">
          <p className="font-serif italic text-3xl text-cream">Ember</p>
          <p className="text-[9px] tracking-[0.35em] uppercase text-gold/70">on Toorak</p>
        </div>
        <SignIn
          appearance={{
            variables: {
              colorBackground: '#1e2f3c',
              colorPrimary: '#FE7743',
              colorText: '#D7D7D7',
              colorTextSecondary: '#8faabc',
              colorInputBackground: '#273F4F',
              colorInputText: '#D7D7D7',
              borderRadius: '0.5rem',
            },
          }}
        />
      </div>
    </main>
  )
}
