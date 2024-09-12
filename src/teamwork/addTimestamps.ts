
export function addTimestamps(parsedObject:any) {
    const date =  new Date().toLocaleString();
    return  parsedObject.map((item: any) => {
        return {
            ...item,
            created_at: date,
            modified_at: date,
        }
    })
}


