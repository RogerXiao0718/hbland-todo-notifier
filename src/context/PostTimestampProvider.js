'use client'
import { createContext, useState } from "react"

export const PostTimestampContext = createContext()

export default function PostTimestampProvider({children}) {
    const [postTimestamp, setPostTimestamp] = useState(new Date())
    return (
        <PostTimestampContext.Provider value={{ postTimestamp, setPostTimestamp }}>
            { children }
        </PostTimestampContext.Provider>
    )
}