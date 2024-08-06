"use client"

import { CardWrapper } from './card-wrapper'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Button } from '../ui/button'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { useState, useTransition } from 'react'
import { ResetPasswordSchema, TResetPasswordSchema } from '@/schemas'
import { reset } from '@/actions/reset'

export function ResetForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const form = useForm<TResetPasswordSchema>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: ""
    }
  })

  const onSubmit = (values: TResetPasswordSchema) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      reset(values)
        .then((data) => {
          setError(data?.error)
          setSuccess(data?.success)
        })
    })

    console.log(values)
  }

  return (
    <CardWrapper
        headerLabel='Forgot your password'
        backButtonLabel="Back to login"
        backButtonHref='/auth/login'
    >
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name="email"
              render= {({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Johndoe@exmaple.com'
                      type='email'
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>

          <FormError
            message={error}
          />
          
          <FormSuccess
            message={success}
          />

          <Button
            type='submit'
            className='w-full'
            disabled={isPending}
          >
            Send reset password email
          </Button>
        </form>
      </Form>

    </CardWrapper>
  )
}
