import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { db } from '#/db'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Plus } from 'lucide-react'

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
  const todos = Route.useLoaderData()
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
        <Button>
          <Plus />
          Add task
        </Button>
      </div>
    </div>
  )
}
