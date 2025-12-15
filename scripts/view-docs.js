#!/usr/bin/env node
/**
 * Markdown Viewer for Terminal
 */

import { readFileSync } from 'fs'
import { marked } from 'marked'
import { markedTerminal } from 'marked-terminal'

marked.use(markedTerminal())

const file = process.argv[2] || 'docs/PROJECT_HEALTH_CHECK.md'

try {
  const content = readFileSync(file, 'utf-8')
  console.log(marked(content))
} catch (error) {
  console.error('Error reading file:', error.message)
  process.exit(1)
}

