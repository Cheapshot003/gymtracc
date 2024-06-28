import * as elements from "typed-html";

interface LayoutProps {
  children?: any;
  title: string;
  user?: any; // Adjust according to your user type
}

export default ({ children, title, user }: LayoutProps) => (
  <html id="all" lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="/public/index.js"></script>
      <script src="https://unpkg.com/htmx.org@2.0.0"></script>
    </head>
    <body class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <header class="w-full bg-blue-500 text-white py-4">
        <div class="container mx-auto flex justify-between items-center">
          <img src="/public/white.png" alt="My App Logo" class="h-10" />
          <nav>
            <ul class="flex space-x-4" hx-boost="true">
              <li><a href="/" class="text-white hover:underline">Home</a></li>
              {user ? (
                [
                  <li><a href="/app/dashboard" class="text-white hover:underline">Dashboard</a></li>,
                  <li><a href="/auth/logout" class="text-white hover:underline">Logout</a></li>
                ]
              ) : (
                [
                  <li><a href="/auth/sign-in" class="text-white hover:underline">Login</a></li>,
                  <li><a href="/auth/sign-up" class="text-white hover:underline">Register</a></li>
                ]
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" class="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer class="w-full bg-blue-500 text-white py-4">
        <div class="container mx-auto text-center">
          <p>&copy; 2024 F4software. No rights reserved.</p>
        </div>
      </footer>
    </body>
  </html>
);
