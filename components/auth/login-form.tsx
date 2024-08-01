"use client"

import { CardWrapper } from './card-wrapper'
import { LoginSchema, TLoginSchema } from '@/schemas'
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

export function LoginForm() {
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = (values: TLoginSchema) => {
    console.log(values)
  }

  return (
    <CardWrapper
        headerLabel='Welcome Back'
        backButtonLabel="Don't have an account"
        backButtonHref='/auth/register'
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
              name="email"
              render= {({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Johndoe@exmaple.com'
                      type='email'
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
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>

          <FormError
            message=''
          />
          
          <FormSuccess
            message=''
          />

          <Button
            type='submit'
            className='w-full'
          >
            Login
          </Button>
        </form>
      </Form>

    </CardWrapper>
  )
}
