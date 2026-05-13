import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'

type Bindings = {
  WGI_DATA: KVNamespace
  USERNAME?: string
  PASSWORD?: string
}

type User = {
  username: string
  password: string
  role: 'admin' | 'user'
}

type Entry = {
  id: string
  date: string
  author: string
  win: string
  goal: string
  improve: string
}

const app = new Hono<{ Bindings: Bindings, Variables: { user: User } }>()

app.use('*', async (c, next) => {
  if (c.req.path.startsWith('/invite/')) {
    return next()
  }
  let usersData = await c.env.WGI_DATA.get('users')
  let users: User[] = []
  
  if (!usersData) {
    users = [{ username: c.env.USERNAME || 'user1', password: c.env.PASSWORD || 'pass1', role: 'admin' }]
    await c.env.WGI_DATA.put('users', JSON.stringify(users))
  } else {
    users = JSON.parse(usersData)
  }

  const auth = basicAuth({
    realm: 'Weekli',
    verifyUser: (username, password) => {
      const user = users.find(u => u.username === username && u.password === password)
      if (user) {
        c.set('user', user)
        return true
      }
      return false
    }
  })
  
  return auth(c, next)
})

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  --bg-color: #f9f8f6;
  --card-bg: #ffffff;
  --text-main: #181818;
  --text-muted: #676d7e;
  --text-dark-gray: #302f2c;
  --border: #e5e5e5;
  --border-light: #efefef;
  --accent: #181818;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
}
body {
  background-color: var(--bg-color);
  color: var(--text-dark-gray);
  font-family: var(--font-sans);
  padding: 3rem 1.5rem;
  margin: 0;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.container {
  max-width: 640px;
  margin: 0 auto;
}
h1, h2, h3 {
  font-family: var(--font-sans);
  font-weight: 600;
  color: var(--text-main);
  margin-top: 0;
  letter-spacing: -0.02em;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}
.logo {
  width: 44px;
  height: 44px;
  display: block;
  border-radius: 22%;
  box-shadow: 0 2px 5px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02) inset;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  object-fit: cover;
}
.logo:hover {
  transform: scale(1.04) translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02) inset;
}
.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-main);
}
.wordmark {
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: -0.04em;
  color: var(--text-main);
}
nav {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 500;
}
nav a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}
nav a:hover {
  color: var(--text-main);
}
.user-badge {
  background: var(--border-light);
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-main);
}
form {
  background: var(--card-bg);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 4rem;
}
.form-header {
  margin-bottom: 0.5rem;
}
.form-header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}
.form-header p {
  margin: 0.25rem 0 0 0;
  color: var(--text-muted);
  font-size: 0.95rem;
}
label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text-main);
}
input, textarea {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.85rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--text-main);
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02) inset;
}
textarea {
  resize: vertical;
  min-height: 90px;
  line-height: 1.5;
}
input:focus, textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}
input::placeholder, textarea::placeholder {
  color: #b5b1a8;
  font-family: var(--font-sans);
}
button {
  background: var(--text-main);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.1s ease;
  align-self: flex-start;
  margin-top: 0.5rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
button:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}
button:active {
  transform: translateY(0);
}
.feed-header {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 0.95rem;
}
.entry {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04);
  border: 1px solid var(--border);
  margin-bottom: 1.5rem;
}
.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
}
.author {
  font-weight: 500;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.author::before {
  content: '';
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
}
.bullet-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.bullet-item:last-child {
  margin-bottom: 0;
}
.bullet-emoji {
  font-size: 1.2rem;
  line-height: 1.2;
  margin-top: 0.1rem;
}
.bullet-content {
  flex: 1;
}
.bullet-content .section-title {
  margin-top: 0;
  margin-bottom: 0.2rem;
}
.section-title {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.section-content {
  margin: 0;
  color: var(--text-dark-gray);
  font-size: 0.95rem;
  line-height: 1.6;
}
/* Admin styles */
.users-list {
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
  margin-bottom: 3rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-main);
  font-size: 0.95rem;
}
.user-item:last-child {
  border-bottom: none;
}
.role-badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--bg-color);
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.role-admin {
  background: var(--text-main);
  color: #ffffff;
}
.delete-user-btn {
  background: rgba(220, 38, 38, 0.3);
  color: #dc2626;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.4rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease, background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  box-shadow: none;
}
.delete-user-btn:hover {
  opacity: 1;
  background: rgba(220, 38, 38, 0.4);
  transform: none;
}
`

import { html } from 'hono/html'

const iconDataUri = "data:image/png;base64,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"

const AppIcon = () => (
  <img src={iconDataUri} class="logo" alt="Weekli Icon" />
)

const Layout = (props: { children: any, user?: User }) => (
  <html lang="en">
    <head>
      <title>Weekli</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Weekli | House Updates</title>
      <meta name="description" content="A simple board for tracking weekly wins, goals, and improvements." />
      <meta property="og:title" content="Weekli" />
      <meta property="og:description" content="A simple board for tracking weekly wins, goals, and improvements." />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Weekli" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="Weekli" />
      <meta name="twitter:description" content="A simple board for tracking weekly wins, goals, and improvements." />
      <link rel="icon" type="image/png" href={iconDataUri} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </head>
    <body>
      <div class="container">
        <header>
          <a href="/" class="brand-link">
            <AppIcon />
            <span class="wordmark">Weekli</span>
          </a>
          <nav>
            {props.user && <span class="user-badge">{props.user.username}</span>}
            {props.user?.role === 'admin' && <a href="/admin">Team</a>}
          </nav>
        </header>
        {props.children}
      </div>
    </body>
  </html>
)

app.get('/', async (c) => {
  const user = c.get('user')
  const data = await c.env.WGI_DATA.get('entries')
  const entries: Entry[] = data ? JSON.parse(data) : []
  
  return c.html(
    <Layout user={user}>
      <form method="POST" action="/submit">
        <div class="form-header">
          <h2>Weekly Reflection</h2>
          <p>Document what happened and where you're going.</p>
        </div>
        <label>
          The Win
          <textarea name="win" required placeholder="What went well this week?"></textarea>
        </label>
        <label>
          The Goal
          <textarea name="goal" required placeholder="What's your primary focus?"></textarea>
        </label>
        <label>
          The Improvement
          <textarea name="improve" required placeholder="What will you improve next week?"></textarea>
        </label>
        <button type="submit">Publish</button>
      </form>

      <h2 class="feed-header">Updates</h2>
      {entries.length === 0 ? <div class="empty-state">No updates yet.</div> : null}
      {entries.map((e) => {
        const dateStr = new Date(e.date).toLocaleDateString(undefined, { 
          weekday: 'long', month: 'short', day: 'numeric' 
        })
        return (
          <div class="entry" key={e.id}>
            <div class="meta">
              <span class="author">{e.author}</span>
              <span>{dateStr}</span>
            </div>
            
            <div class="bullet-item">
              <span class="bullet-emoji">🏆</span>
              <div class="bullet-content">
                <div class="section-title">The Win</div>
                <p class="section-content">{e.win}</p>
              </div>
            </div>
            
            <div class="bullet-item">
              <span class="bullet-emoji">🎯</span>
              <div class="bullet-content">
                <div class="section-title">The Goal</div>
                <p class="section-content">{e.goal}</p>
              </div>
            </div>
            
            <div class="bullet-item">
              <span class="bullet-emoji">🌱</span>
              <div class="bullet-content">
                <div class="section-title">The Improvement</div>
                <p class="section-content">{e.improve}</p>
              </div>
            </div>
          </div>
        )
      })}
    <form method="POST" action="/admin/password">
        <div class="form-header">
          <h2>Change Password</h2>
          <p>Update the password for your account.</p>
        </div>
        <label>
          New Password
          <input type="password" name="new_password" required autocomplete="off" />
        </label>
        <button type="submit">Update Password</button>
      </form>
    </Layout>
  )
})

app.post('/submit', async (c) => {
  const user = c.get('user')
  const body = await c.req.parseBody()
  
  const newEntry: Entry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    author: user.username,
    win: String(body.win || ''),
    goal: String(body.goal || ''),
    improve: String(body.improve || '')
  }

  const data = await c.env.WGI_DATA.get('entries')
  const entries: Entry[] = data ? JSON.parse(data) : []
  
  entries.unshift(newEntry)
  
  await c.env.WGI_DATA.put('entries', JSON.stringify(entries))
  
  return c.redirect('/')
})

app.get('/admin', async (c) => {
  const user = c.get('user')
  if (user.role !== 'admin') {
    return c.text('403 Forbidden: Admins only.', 403)
  }

  const baseUrl = new URL(c.req.url).origin
  const usersData = await c.env.WGI_DATA.get('users')
  const users: User[] = usersData ? JSON.parse(usersData) : []
  
  const invitesData = await c.env.WGI_DATA.get('invites')
  const invites: string[] = invitesData ? JSON.parse(invitesData) : []

  return c.html(
    <Layout user={user}>
      <h2 class="feed-header">Team</h2>
      <div class="users-list">
        {users.map(u => (
          <div class="user-item" key={u.username}>
            <span>{u.username}</span>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class={u.role === 'admin' ? 'role-badge role-admin' : 'role-badge'}>
                {u.role}
              </span>
              {u.username !== user.username ? (
                <form method="POST" action="/admin/users/delete" style="margin:0; padding:0; box-shadow:none; border:none; background:transparent;">
                  <input type="hidden" name="username_to_delete" value={u.username} />
                  <button type="submit" class="delete-user-btn" title="Remove user">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </form>
              ) : <div style="width: 26px;"></div>}
            </div>
          </div>
        ))}
      </div>

      <h2 class="feed-header">Active Invites</h2>
      <div class="users-list" style="margin-bottom: 3rem;">
        {invites.length === 0 ? <div class="user-item"><span style="color:var(--text-muted)">No active invites.</span></div> : null}
        {invites.map(token => (
          <div class="user-item" key={token} style="gap: 1rem;">
            <code style="background:var(--bg-color); padding:0.4rem 0.6rem; border-radius:6px; font-size:0.85rem; border:1px solid var(--border-light); word-break: break-all;">{baseUrl}/invite/{token}</code>
            <form method="POST" action="/admin/invites/delete" style="margin:0; padding:0; box-shadow:none; border:none; background:transparent; display:inline-block; min-width:auto;">
              <input type="hidden" name="token" value={token} />
              <button type="submit" style="margin:0; padding:0.4rem 0.8rem; font-size:0.8rem; background:var(--text-muted);">Revoke</button>
            </form>
          </div>
        ))}
      </div>

      <form method="POST" action="/admin/invites">
        <div class="form-header">
          <h2>Generate Invite Link</h2>
          <p>Create a single-use link for a housemate to set up their account.</p>
        </div>
        <label>
          Housemate Name
          <input type="text" name="invite_username" required autocomplete="off" placeholder="e.g. alice" />
        </label>
        <button type="submit">Create Link</button>
      </form>
    </Layout>
  )
})

app.post('/admin/invites', async (c) => {
  const user = c.get('user')
  if (user.role !== 'admin') return c.text('403 Forbidden', 403)

  const body = await c.req.parseBody()
  const rawName = String(body.invite_username || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  if (!rawName) return c.text('Invalid name', 400)

  // Generate a short 12-char hex string
  const shortHash = crypto.randomUUID().replace(/-/g, '').slice(0, 12)
  const token = `${rawName}-${shortHash}`
  
  const invitesData = await c.env.WGI_DATA.get('invites')
  const invites: string[] = invitesData ? JSON.parse(invitesData) : []
  
  invites.push(token)
  await c.env.WGI_DATA.put('invites', JSON.stringify(invites))

  return c.redirect('/admin')
})

app.post('/admin/invites/delete', async (c) => {
  const user = c.get('user')
  if (user.role !== 'admin') return c.text('403 Forbidden', 403)

  const body = await c.req.parseBody()
  const token = String(body.token)
  
  const invitesData = await c.env.WGI_DATA.get('invites')
  let invites: string[] = invitesData ? JSON.parse(invitesData) : []
  invites = invites.filter(t => t !== token)
  await c.env.WGI_DATA.put('invites', JSON.stringify(invites))

  return c.redirect('/admin')
})

app.post('/admin/users/delete', async (c) => {
  const user = c.get('user')
  if (user.role !== 'admin') return c.text('403 Forbidden', 403)

  const body = await c.req.parseBody()
  const toDelete = String(body.username_to_delete || '').trim()

  if (toDelete === user.username) {
    return c.text('Cannot delete yourself', 400)
  }

  const usersData = await c.env.WGI_DATA.get('users')
  let users: User[] = usersData ? JSON.parse(usersData) : []
  
  users = users.filter(u => u.username !== toDelete)
  await c.env.WGI_DATA.put('users', JSON.stringify(users))

  return c.redirect('/admin')
})

app.get('/invite/:token', async (c) => {
  const token = c.req.param('token')
  const invitesData = await c.env.WGI_DATA.get('invites')
  const invites: string[] = invitesData ? JSON.parse(invitesData) : []

  if (!invites.includes(token)) {
    return c.html(
      <Layout>
        <div class="empty-state">This invite link is invalid or has already been used.</div>
      </Layout>
    )
  }

  const username = token.split('-')[0]

  return c.html(
    <Layout>
      <form method="POST" action={`/invite/${token}`}>
        <div class="form-header">
          <h2>Join Weekli as @{username}</h2>
          <p>Set a password to secure your account and join the board.</p>
        </div>
        <label>
          Password
          <input type="password" name="new_password" required autocomplete="off" />
        </label>
        <button type="submit">Create Account</button>
      </form>
    </Layout>
  )
})

app.post('/invite/:token', async (c) => {
  const token = c.req.param('token')
  const invitesData = await c.env.WGI_DATA.get('invites')
  let invites: string[] = invitesData ? JSON.parse(invitesData) : []

  if (!invites.includes(token)) {
    return c.text('Invalid invite', 400)
  }

  const body = await c.req.parseBody()
  const newUsername = token.split('-')[0]
  const newPassword = String(body.new_password || '').trim()

  if (!newPassword) {
    return c.text('Missing password', 400)
  }

  let usersData = await c.env.WGI_DATA.get('users')
  let users: User[] = usersData ? JSON.parse(usersData) : []

  if (users.find(u => u.username === newUsername)) {
    return c.text('Username already exists. Ask the admin to issue a new invite under a different name.', 400)
  }

  users.push({
    username: newUsername,
    password: newPassword,
    role: 'user'
  })
  await c.env.WGI_DATA.put('users', JSON.stringify(users))

  invites = invites.filter(t => t !== token)
  await c.env.WGI_DATA.put('invites', JSON.stringify(invites))

  return c.html(
    <Layout>
      <div class="empty-state" style="padding: 4rem 2rem;">
        <h2 style="font-family: var(--font-sans); font-size: 1.8rem; margin-bottom: 1rem; color: var(--text-main);">Welcome, {newUsername}!</h2>
        <p style="margin-bottom: 2rem;">Your account has been created successfully.</p>
        <a href="/" style="display:inline-block; padding:0.8rem 1.5rem; background:var(--text-main); color:white; text-decoration:none; border-radius:8px; font-weight:500; transition: opacity 0.2s;">Enter Board</a>
      </div>
    </Layout>
  )
})

app.post('/admin/password', async (c) => {
  const user = c.get('user')
  const body = await c.req.parseBody()
  const newPassword = String(body.new_password || '').trim()

  if (!newPassword) return c.text('Missing password', 400)

  const usersData = await c.env.WGI_DATA.get('users')
  let users: User[] = usersData ? JSON.parse(usersData) : []

  const userIndex = users.findIndex(u => u.username === user.username)
  if (userIndex !== -1) {
    users[userIndex].password = newPassword
    await c.env.WGI_DATA.put('users', JSON.stringify(users))
  }

  return c.redirect('/admin')
})

export default app
