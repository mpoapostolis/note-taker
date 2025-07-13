# Note Taker

A modern, feature-rich note-taking application built with Next.js 15, TypeScript, and TipTap editor.

## Screenshots

### Homepage - Document List
![Homepage](https://github.com/mpoapostolis/note-taker/blob/main/public/Screenshot%202025-07-13%20at%2011.25.49%E2%80%AFPM.png?raw=true)

### Document Editor
![Document Editor](https://github.com/mpoapostolis/note-taker/blob/main/public/Screenshot%202025-07-13%20at%2011.26.04%E2%80%AFPM.png?raw=true)

## How to Use

### Creating Documents

1. Click the "New Document" button on the homepage
2. Enter a title for your document
3. Click "Create Document"

### Editing Documents

1. Click on any document from the homepage to open it
2. Edit the title by clicking on it in the header
3. Use the rich text editor to write your content
4. The document auto-saves as you type (1 second delay)

### Editor Features

- **Text Formatting**: Bold, italic, underline
- **Headings**: Title, Subtitle, Heading styles
- **Lists**: Bullet points and numbered lists
- **Undo/Redo**: Use buttons or standard keyboard shortcuts
- **Auto-save**: Changes save automatically

### Managing Documents

- View all documents on the homepage in a grid layout
- See creation and last updated timestamps
- Delete documents using the trash icon (with confirmation)
- Navigate back to homepage using the arrow button

## Installation & Setup

### Prerequisites

- Node.js 18+
- Neon PostgreSQL database

### Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` file:

```env
DATABASE_URL=your_neon_database_url
```

3. Set up database table:

```sql
CREATE TABLE docs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Run the application:

```bash
npm run dev
```

## Technology Choices

### Why Next.js 15?

- **App Router**: Modern routing with server components
- **Turbopack**: Fast development server
- **Server Actions**: Simplified form handling

### Why TipTap?

- **Rich text editing**: Professional editor experience
- **Extensible**: Modular extensions system
- **TypeScript support**: Built with TypeScript
- **ProseMirror-based**: Robust document model

### Why Neon PostgreSQL?

- **Serverless**: Automatic scaling and hibernation
- **Edge compatibility**: Works with serverless functions
- **Full PostgreSQL**: Complete SQL feature set
- **Developer experience**: Easy setup and management

### Why DaisyUI + Tailwind?

- **Component system**: Pre-built accessible components
- **Design consistency**: Cohesive design tokens
- **Responsive**: Mobile-first responsive design
- **Customizable**: Easy theming and customization

### Why SWR?

- **Data fetching**: Automatic caching and revalidation
- **Real-time updates**: Optimistic updates
- **Error handling**: Built-in error and loading states
- **Performance**: Automatic deduplication and optimization

## Development Notes

Built with assistance from Claude Code (~5 hours development time). Claude Code helped with:
- Component architecture and structure
- TipTap editor integration and configuration
- Database schema design and queries
- UI/UX implementation with DaisyUI
- Auto-save functionality and state management

## Project Architecture

```
src/
├── actions/           # Server actions for form handling
├── app/
│   ├── api/docs/      # REST API endpoints
│   ├── doc/[id]/      # Document editor page
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Homepage with document list
├── components/        # React components
└── lib/               # Database utilities
```

## Development Commands

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Code linting
