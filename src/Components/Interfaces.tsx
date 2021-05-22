
export interface User {
    id: number,
    name?: string,
    following: Array<number>,
    interests: Array<number>
}

export interface Interest {
    id: number,
    name: string,
}
