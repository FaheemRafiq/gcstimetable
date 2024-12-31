import { IsActive, Shift } from ".";

export type ClassType = "CLASS" | "LAB";

export type Teacher = {
    id: number;
    name: string;
    personnel_number: string;
    email: string;
    cnic: string | null;
    phone_number: string;
    bank_iban: string;
    isMale: boolean;
    date_of_birth: string;
    date_of_joining_in_this_college: string;
    date_of_joining_govt_service: string;
    date_of_joining_current_rank: string;
    father_name: string;
    seniority_number: number;
    qualification: string;
    highest_degree_awarding_institute: string;
    highest_degree_awarding_country: string;
    highest_degree_awarding_year: number;
    degree_title: string;
    rank: string;
    position: string;
    department_id: number | null;
    isvisiting: boolean;
    is_active: IsActive;
    created_at: string;
    updated_at: string;
};

export type Department = {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
};

export type Instituion = {
    id: number;
    name: string;
    email: string;
    address: string;
    phone: string;
    created_at: string;
    updated_at: string;
};

export type Slot = {
    id: number;
    code: string;
    name: string;
    is_practical: number;
    shift_id: number;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
};

export type Day = {
    id: number;
    number: number;
    name: string;
    code: string;
    institution?: Instituion;
};

export type Allocation = {
    id: number;
    name: string | null;
    day_id: number;
    slot_id: number;
    teacher_id: number | null;
    course_id: number | null;
    room_id: number | null;
    section_id: number;
    time_table_id: number;

    // Relations
    day: Day;
    slot: Slot;
    teacher?: Teacher;
    course?: Course;
    room?: Room;
    section: Section;
};

export type Course = {
    id: number;
    code: string;
    name: string;
    credit_hours: number;
    display_code: string;
    institution_id: number;
    type: ClassType;
    is_default: number;
    created_at: string;
    updated_at: string;

    semesters?: Semester[];
    semesters_count?: number
};

export type Room = {
    id: number;
    code: string;
    name: string;
    type: string;
    capacity: number;
    isavailable: boolean;
    institution_id: number;
    created_at: string;
    updated_at: string;
};

export type Section = {
    id: number;
    name: string;
    is_active: IsActive;
    semester_id: number;
    semester?: Semester;
    created_at: string;
    updated_at: string;
};

export type Semester = {
    id: number;
    name: string;
    number: number;
    is_active: IsActive;
    program_id: number;
    created_at: string;
    updated_at: string;

    // Relations
    courses?: Course[];
    sections?: Section[];
    program?: Program;

    sections_count?: number;
};

export type Program = {
    id: number;
    name: string;
    code: string;
    duration: number;
    type: "ADP" | "INTER" | "BS";
    shift_id: number;
    department_id: number;
    created_at: string;
    updated_at: string;

    // Relations
    shift?: Shift;
    department?: Department;
    semesters?: Semester[];
};

export type StringObject = {
    [key: string]: string;
};
