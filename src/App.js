import React, { useState, useMemo, useCallback } from 'react'
import { createEditor, Text } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const App = () => {
  const [editor] = useState(() => withReact(createEditor()))
  // state to store text value from editor
  const [finalText, setFinalText] = useState('')

  // Define a custom renderLeaf function to apply styles to hashtags.
  const renderLeaf = useCallback((props) => {
    if (props.leaf.type === 'hashtag') {
      return <span {...props.attributes} style={{ fontWeight: 'bold' }}>{props.children}</span>
    }
    return <span {...props.attributes}>{props.children}</span>
  }, [])

  // Define a custom decorate function to identify hashtags.
  const decorate = useCallback(([node, path]) => {
    const ranges = []

    if (!Text.isText(node)) {
      return ranges
    }

    const { text } = node
    const pattern = /\B#\w+/g
    let match

    while ((match = pattern.exec(text)) !== null) {
      const start = match.index
      const end = start + match[0].length
      ranges.push({
      anchor: { path, offset: start },
      focus: { path, offset: end },
      type: 'hashtag',
      })
    }

    return ranges
  }, [])

  // Add a change event handler that will log the new value of the editor.
  const onChange = (newValue) => {
    setFinalText(newValue)
  }
  

  return (
    // Add the editable component inside the context.
<div>
    <Slate editor={editor} initialValue={finalText} onChange={onChange}>
      <Editable renderLeaf={renderLeaf} decorate={decorate} />
    </Slate>

      <button onClick={() => setFinalText(finalText[0]?.children[0].text + ">")}>Add x to the end of the text</button>
    </div>
    )
}

export default App