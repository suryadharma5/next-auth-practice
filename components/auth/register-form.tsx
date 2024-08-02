"use client"

import { CardWrapper } from './card-wrapper'
import { RegisterSchema, TRegisterSchema } from '@/schemas'
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
import { register } from '@/actions/register'

export function RegisterForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const form = useForm<TRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    }
  })

  const onSubmit = (values: TRegisterSchema) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      register(values)
        .then((data) => {
          setError(data.error)
          setSuccess(data.success)
          form.reset()
        })
    })
  }

  return (
    <CardWrapper
        headerLabel='Create an account'
        backButtonLabel="Already have an account"
        backButtonHref='/auth/login'
        showSocial
    >
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name="name"
              render= {({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='John Doe'
                      type='text'
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="password"
              render= {({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='password'
                      type='password'
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
            Register
          </Button>
        </form>
      </Form>

    </CardWrapper>
  )
}
