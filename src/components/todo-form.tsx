import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader, Plus } from 'lucide-react'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import z from 'zod'
import { db } from '#/db'
import { todos } from '#/db/schema'
import { redirect } from '@tanstack/react-router'

const addTodo = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      name: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    await db.insert(todos).values({ ...data, isComplete: false })
    throw redirect({ to: '/' })
  })

export function TodoForm() {
  const nameRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const addtodoFn = useServerFn(addTodo)
  const handleSubmit = async (e: ChangeEvent) => {
    e.preventDefault()
    const name = nameRef.current?.value
    if (!name) return
    setIsLoading(true)
    await addtodoFn({ data: { name } })
    setIsLoading(false)
  }
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Enter your todo..."
        className="flex-1"
        aria-label="Name"
        autoFocus
        ref={nameRef}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <Loader className="animate-spin" />
        ) : (
          <>
            <Plus />
            Add
          </>
        )}
      </Button>
    </form>
  )
}
