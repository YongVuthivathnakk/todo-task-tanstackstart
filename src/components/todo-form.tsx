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
import type { ITodo } from '#/defnitions/todo'
import { eq } from 'drizzle-orm'

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

const editTodo = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    await db.update(todos).set(data).where(eq(todos.id, data.id))
    throw redirect({ to: '/' })
  })

export function TodoForm({ todo }: { todo?: ITodo }) {
  const nameRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const addtodoFn = useServerFn(addTodo)
  const updateTodoFn = useServerFn(editTodo)
  const handleSubmit = async (e: ChangeEvent) => {
    e.preventDefault()
    const name = nameRef.current?.value
    if (!name) return
    setIsLoading(true)

    if (todo == null) {
      await addtodoFn({ data: { name } })
    } else {
      await updateTodoFn({ data: { name, id: todo.id } })
    }
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
        defaultValue={todo?.name}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <Loader className="animate-spin" />
        ) : todo ? (
          <>Update</>
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
