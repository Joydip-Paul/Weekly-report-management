export enum MemberRole {
    Developer = 'Developer',
    Designer = 'Designer',
    Manager = 'Manager'
}

export interface Task {
    module: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High'; // ✅ Must match exact literal values
    completed: number;
    blocker?: string;
}


export interface Member {
    name: string;
    role?: MemberRole;
    tasks?: Task[];
}
