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
import type { ITodo } from '#/defnitions/todo'
import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { cn } from 'cn'
import { Edit, ListTodoIcon, Plus, Trash } from 'lucide-react'

const serverLoader = createServerFn({ method: 'GET' }).handler(() => {
  return db.query.todos.findMany()
})

export const Route = createFileRoute('/')({
  component: App,
  loader: () => {
    return serverLoader()
  },
})

function App() {
  const todos: ITodo[] = Route.useLoaderData()
  const completedCount = todos.filter((t) => t.isComplete).length
  const totalCount = todos.length
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
        <Button size="sm" asChild>
          <Link to="/todos/new">
            <Plus />
            Add task
          </Link>
        </Button>
      </div>

      <TodoListTable todos={todos} />
    </div>
  )
}

function TodoListTable({ todos }: { todos: ITodo[] }) {
  if (todos.length === 0) {
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
        {todos.map((todo) => (
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
  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={todo.isComplete} />
      </TableCell>
      <TableCell
        className={cn(
          'font-medium',
          todo.isComplete && 'text-muted-foreground line-through',
        )}
      >
        {todo.name}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(todo.createdAt)}
      </TableCell>

      <TableCell>
        <Button variant={'ghost'}>
          {/* <Link to="/todos/$id/edit"> */}
          <Edit />
          {/* </Link> */}
        </Button>
        <Button variant={'ghostDestructive'}>
          <Trash />
        </Button>
      </TableCell>
    </TableRow>
  )
}
