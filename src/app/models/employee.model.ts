export enum MemberRole {
    Developer = 'Developer',
    Designer = 'Designer',
    Manager = 'Manager'
}

export interface Task {
    id: string;
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


export interface DrawerResult {
    success: boolean;
    action?: 'add' | 'edit' | 'delete';
    data?: any;
}