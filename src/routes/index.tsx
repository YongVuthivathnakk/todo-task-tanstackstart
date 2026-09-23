import LocalCountButton from '#/components/local-count-button'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { db } from '#/db'
import { todos } from '#/db/schema'
import type { ITodo } from '#/definitions/todo'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { cn } from 'cn'
import { eq } from 'drizzle-orm'
import { Edit, ListTodoIcon, Plus, Trash } from 'lucide-react'
import { startTransition, useState } from 'react'
import z from 'zod'

const serverLoader = createServerFn({ method: 'GET' }).handler(() => {
  return db.query.todos.findMany()
})

const deleteFn = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await db.delete(todos).where(eq(todos.id, data.id))

    return { error: false }
  })

const toggleFn = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      id: z.string().min(1),
      isCompleted: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    await db
      .update(todos)
      .set({ isComplete: data.isCompleted })
      .where(eq(todos.id, data.id))
  })

export const Route = createFileRoute('/')({
  component: App,
  loader: () => {
    return serverLoader()
  },
})

function App() {
  const todoList: ITodo[] = Route.useLoaderData()
  const completedCount = todoList.filter((t) => t.isComplete).length
  const totalCount = todoList.length
  return (
    <div className="min-h-screen container space-y-8">
      <div className="flex justify-between items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Todo List</h1>
          {totalCount > 0 && (
            <Badge>
              {completedCount} of {totalCount} completed
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LocalCountButton />
          <Button size="sm" asChild>
            <Link to="/todos/new">
              <Plus />
              Add task
            </Link>
          </Button>
        </div>
      </div>

      <TodoListTable todoList={todoList} />
    </div>
  )
}

function TodoListTable({ todoList }: { todoList: ITodo[] }) {
  if (todoList.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant={'icon'}>
            <ListTodoIcon />
          </EmptyMedia>
          <EmptyTitle>No Todos</EmptyTitle>
          <EmptyDescription>Try adding a new todos</EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Button asChild>
            <Link to="/todos/new">
              <Plus />
              Add task
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Task</TableHead>
          <TableHead>Created On</TableHead>
          <TableHead className="w-0"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todoList.map((todo) => (
          <TodoTableRow todo={todo} key={todo.id} />
        ))}
      </TableBody>
    </Table>
  )
}

function TodoTableRow({ todo }: { todo: ITodo }) {
  const formatDate = (date: Date) => {
    const formatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'short',
    })
    return formatter.format(date)
  }

  const deleteFnServer = useServerFn(deleteFn)
  const toggleFnServer = useServerFn(toggleFn)
  const [isCurrentComplete, setIsCurrentComplete] = useState(todo.isComplete)
  const router = useRouter()
  return (
    <TableRow
      onClick={async (e) => {
        const target = e.target as HTMLElement
        if (target.closest('[data-actions]')) return
        setIsCurrentComplete((c) => !c)

        startTransition(async () => {
          await toggleFnServer({
            data: { id: todo.id, isCompleted: !todo.isComplete },
          })
          router.invalidate()
        })
      }}
    >
      <TableCell>
        <Checkbox checked={isCurrentComplete} />
      </TableCell>
      <TableCell
        className={cn(
          'font-medium',
          isCurrentComplete && 'text-muted-foreground line-through',
        )}
      >
        {todo.name}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(todo.createdAt)}
      </TableCell>

      <TableCell data-actions>
        <Button variant={'ghost'}>
          <Link to="/todos/$id/edit" params={{ id: todo.id }}>
            <Edit />
          </Link>
        </Button>
        <Button
          onClick={async () => {
            const res = await deleteFnServer({ data: { id: todo.id } })
            router.invalidate()
            return res
          }}

          variant={'ghostDestructive'}
        >
          <Trash />
        </Button>
      </TableCell>
    </TableRow>
  )
}
