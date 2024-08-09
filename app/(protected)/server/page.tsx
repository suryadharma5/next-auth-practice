import { UserInfo } from '@/components/user-info'
import { currentUser } from '@/lib/server-session'

async function ServerPage() {
  const user = await currentUser()

  return (
    <UserInfo
      label='Server Component 💻'
      user={user}
    />
  )
}

export default ServerPage