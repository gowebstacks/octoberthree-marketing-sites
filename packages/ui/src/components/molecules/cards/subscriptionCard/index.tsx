import { Button } from "../../../atoms"

interface SubscriptionCardProps {
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
  onSubmit?: (email: string) => void
}

const SubscriptionCard = ({ 
  title = "Subscribe via Email",
  description = "Subscribe to our blog to get insights sent directly to your inbox.",
  placeholder = "Enter your email",
  buttonText = "Book a Demo",
}: SubscriptionCardProps) => {
  return (
    <div className="bg-blog-cta-card bg-center bg-no-repeat bg-[auto_400px] rounded-lg px-4.5 lg:px-6 py-6 lg:py-8 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-display-3xl font-medium text-heading">
          {title}
        </h3>
        <p className="text-lg text-body leading-normal">
          {description}
        </p>
      </div>

      <form className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="email"
            placeholder={placeholder}
            className="w-full px-2 lg:px-3 py-2 h-12 rounded-sm border border-secondary text-sm text-heading placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          />
        </div>
        
        <Button
          variant="primary"
          size="md"
          fullWidth
          label={buttonText}
        />
      </form>
    </div>
  )
}

export default SubscriptionCard
