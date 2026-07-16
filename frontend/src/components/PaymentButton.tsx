interface PaymentButtonProps {
  onClick: () => void
  disabled: boolean
  paid: boolean
  loading: boolean
}

export default function PaymentButton({ onClick, disabled, paid, loading }: PaymentButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`w-full px-8 py-4 rounded-full font-bold text-lg transition ${
        disabled
          ? 'bg-gray-600 cursor-not-allowed opacity-50'
          : paid
          ? 'bg-purple-600 hover:bg-purple-700'
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Processing...
        </span>
      ) : paid ? (
        '✨ Convert Now'
      ) : (
        '💳 Unlock ($1)'
      )}
    </button>
  )
}
