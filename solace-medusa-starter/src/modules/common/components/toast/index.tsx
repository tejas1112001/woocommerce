import { CheckCircleIcon, XCircleIcon } from '@modules/common/icons'
import { toast as sonnerToast } from 'sonner'

const baseClassname = {
  classNames: {
    toast:
      'bg-primary [.dark_&]:bg-static border rounded-xl shadow-lg flex items-center p-3.5 pr-10 gap-3 text-sm transition-all',
    title: 'text-basic-primary [.dark_&]:text-static text-sm font-medium leading-5',
    closeButton:
      'text-basic-primary [.dark_&]:text-static',
  },
}

export function toast(variant: 'success' | 'error', text: string) {
  switch (variant) {
    case 'success':
      sonnerToast.success(text, {
        duration: 2500,
        icon: <CheckCircleIcon className="h-5 w-5 text-positive shrink-0" />,
        classNames: {
          ...baseClassname.classNames,
          toast: `${baseClassname.classNames.toast} border-positive/40`,
        },
      })
      break
    case 'error':
    default:
      sonnerToast.error(text, {
        duration: 2500,
        icon: <XCircleIcon className="h-5 w-5 text-negative shrink-0" />,
        classNames: {
          ...baseClassname.classNames,
          toast: `${baseClassname.classNames.toast} border-negative/40`,
        },
      })
      break
  }
}

