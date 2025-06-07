export enum MemberRole {
    Developer = 'Developer',
    Designer = 'Designer',
    Manager = 'Manager'
}

export interface Task {
    module: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    completed: number;
    blocker?: string;
}


export interface Member {
    name: string;
    role?: MemberRole;
    tasks?: Task[];
}
