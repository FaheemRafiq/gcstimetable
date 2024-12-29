import * as React from "react";
import { Head, router, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/inputs/date-picker";
import { PhoneNumberInput } from "@/components/inputs/phone-number";
import { EmailInput } from "@/components/inputs/email-input";
import { CNICInput } from "@/components/inputs/cnic-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { AutoCompleteSelect } from "@/components/combobox";
import YearPicker from "@/components/inputs/year-picker";
import { Teacher } from "@/types/database";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

interface FormSection {
    title: string;
    fields: JSX.Element[];
}

interface TeacherFormProps {
    initialData?: Partial<Teacher>;
    ranks: { [key: string]: string };
    positions: { [key: string]: string };
    departments: { [key: string]: string };
    qualifications: { [key: string]: string };

}

export function TeacherForm({
    initialData,
    ranks,
    positions,
    departments,
    qualifications
}: TeacherFormProps) {
    const isEditing = Boolean(initialData);

    const { data, setData, errors, post, put, processing, setError } = useForm<Omit<Teacher, 'id' | 'created_at' | 'updated_at'>>({
        name: initialData?.name ?? "",
        personnel_number: initialData?.personnel_number ?? "",
        email: initialData?.email ?? "",
        cnic: initialData?.cnic ?? null,
        phone_number: initialData?.phone_number ?? "",
        bank_iban: initialData?.bank_iban ?? "",
        isMale: initialData?.isMale ?? true,
        date_of_birth: initialData?.date_of_birth ?? "",
        date_of_joining_in_this_college: initialData?.date_of_joining_in_this_college ?? "",
        date_of_joining_govt_service: initialData?.date_of_joining_govt_service ?? "",
        date_of_joining_current_rank: initialData?.date_of_joining_current_rank ?? "",
        father_name: initialData?.father_name ?? "",
        seniority_number: initialData?.seniority_number ?? 0,
        qualification: initialData?.qualification ?? "",
        highest_degree_awarding_institute: initialData?.highest_degree_awarding_institute ?? "",
        highest_degree_awarding_country: initialData?.highest_degree_awarding_country ?? "",
        highest_degree_awarding_year: initialData?.highest_degree_awarding_year ?? new Date().getFullYear(),
        degree_title: initialData?.degree_title ?? "",
        rank: initialData?.rank ?? "",
        position: initialData?.position ?? "",
        department_id: initialData?.department_id ?? null,
        isvisiting: initialData?.isvisiting ?? true,
        is_active: initialData?.is_active ?? 'active',
    });

    function getStringDate(date: Date | null): string {
        if (!date) return "";

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const Departments = React.useMemo(() => {
        return Object.entries(departments).map(([key, value]) => ({
            value: key,
            label: value,
        })) ?? []
    }, [departments])


    React.useEffect(() => {
        console.log("data => ", data);
    }, [data])

    const formSections: FormSection[] = [
        {
            title: "Personal Information",
            fields: [
                <div key="name">
                    <InputLabel htmlFor="name" value="Name" aria-required />
                    <Input
                        autoFocus
                        className="w-full"
                        placeholder="Enter Name"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    <InputError message={errors.name} />
                </div>,
                <div key="personal_number">
                    <InputLabel htmlFor="personal_number" value="Personal Number" aria-required />
                    <PhoneNumberInput
                        id="personal_number"
                        value={data.personnel_number}
                        setValue={value => setData('personnel_number', value)}
                    />
                    <InputError message={errors.personnel_number} />
                </div>,
                <div key="father_name">
                    <InputLabel htmlFor="father_name" value="Father's Name" aria-required />
                    <Input
                        className={"w-full"}
                        id="father_name"
                        placeholder="Enter Father Name"
                        value={data.father_name}
                        onChange={(e) => setData("father_name", e.target.value)}
                        required
                    />
                    <InputError message={errors.father_name} />
                </div>,
                <div key="gender">
                    <InputLabel htmlFor="isMale" value="Gender" aria-required />
                    <Select
                        name="isMale"
                        value={data.isMale ? "1" : "0"}
                        onValueChange={(value) => setData("isMale", value == "1")}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Male</SelectItem>
                            <SelectItem value="0">Female</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.isMale} />
                </div>,
                <div key="date_of_birth">
                    <InputLabel htmlFor="date_of_birth" value="Date of Birth" aria-required />
                    <DatePicker
                        className={"w-full"}
                        id="date_of_birth"
                        value={data.date_of_birth}
                        onChange={(date) => setData("date_of_birth", getStringDate(date))}
                        minDate={new Date(1900, 0, 1)}
                        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                        isError={Boolean(errors.date_of_birth)}
                        required
                    />
                    <InputError message={errors.date_of_birth} />
                </div>,
                <div key="cnic">
                    <InputLabel htmlFor="cnic" value="CNIC" />
                    <CNICInput
                        inputId="cnic"
                        className={"w-full"}
                        value={data.cnic ?? ""}
                        onChange={(value) => setData("cnic", value)}
                        setError={(error) => setError("cnic", error)}
                    />
                    <InputError message={errors.cnic} />
                </div>,
            ]
        },
        {
            title: "Contact Information",
            fields: [
                <div key="email">
                    <InputLabel htmlFor="email" value="Email" aria-required />
                    <EmailInput
                        className="w-full"
                        id="email"
                        placeholder="example@gmail.com"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} />
                </div>,
                <div key="phone_number">
                    <InputLabel htmlFor="phone_number" value="Phone Number" />
                    <PhoneNumberInput
                        id="phone_number"
                        value={data.phone_number}
                        setValue={value => setData('phone_number', value)}
                    />
                    <InputError message={errors.phone_number} />
                </div>,
                <div key="bank_iban">
                    <InputLabel htmlFor="bank_iban" value="Bank IBAN" />
                    <Input
                        className={"w-full"}
                        id="bank_iban"
                        placeholder="IBAN"
                        value={data.bank_iban}
                        onChange={(e) => setData("bank_iban", e.target.value)}
                    />
                    <InputError message={errors.bank_iban} />
                </div>
            ]
        },
        {
            title: "Academic Information",
            fields: [
                <div key="qualification">
                    <InputLabel htmlFor="qualification" value="Qualification" aria-required />
                    <Select
                        name="qualification"
                        value={data.qualification}
                        onValueChange={(value) => setData("qualification", value)}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Qualification" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(qualifications).map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.qualification} />
                </div>,
                <div key="degree_title">
                    <InputLabel htmlFor="degree_title" value="Degree Title" />
                    <Input
                        className={"w-full"}
                        id="degree_title"
                        placeholder="i.e Master of Science"
                        value={data.degree_title}
                        onChange={(e) => setData("degree_title", e.target.value)}
                        required
                    />
                    <InputError message={errors.degree_title} />
                </div>,
                <div key="highest_degree_awarding_institute">
                    <InputLabel htmlFor="highest_degree_awarding_institute" value="Highest Degree Awarding Institute" />
                    <Input
                        className={"w-full"}
                        id="highest_degree_awarding_institute"
                        placeholder="i.e University of Punjab"
                        value={data.highest_degree_awarding_institute}
                        onChange={(e) => setData("highest_degree_awarding_institute", e.target.value)}
                    />
                    <InputError message={errors.highest_degree_awarding_institute} />
                </div>,
                <div key="highest_degree_awarding_country">
                    <InputLabel htmlFor="highest_degree_awarding_country" value="Highest Degree Awarding Country" />
                    <Input
                        className={"w-full"}
                        id="highest_degree_awarding_country"
                        placeholder="i.e Pakistan"
                        value={data.highest_degree_awarding_country}
                        onChange={(e) => setData("highest_degree_awarding_country", e.target.value)}
                    />
                    <InputError message={errors.highest_degree_awarding_country} />
                </div>,
                <div key="highest_degree_awarding_year">
                    <InputLabel htmlFor="highest_degree_awarding_year" value="Highest Degree Awarding Year" />
                    <YearPicker
                        id="highest_degree_awarding_year"
                        value={data.highest_degree_awarding_year}
                        onChange={(year) => setData("highest_degree_awarding_year", Number(year))}
                        error={Boolean(errors.highest_degree_awarding_year)}
                        endYear={new Date().getFullYear()}
                    />
                    <InputError message={errors.highest_degree_awarding_year} />
                </div>
            ]
        },
        {
            title: "Employment Details",
            fields: [
                <div key="rank">
                    <InputLabel htmlFor="rank" value="Rank" aria-required />
                    <Select
                        name="rank"
                        value={data.rank}
                        onValueChange={(value) => setData("rank", value)}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Rank" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(ranks).map(([key, value]) => (
                                <SelectGroup key={key}>
                                    {value.split(',').map((rank) => (
                                        <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                                    ))}
                                </SelectGroup>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.rank} />
                </div>,
                <div key="position">
                    <InputLabel htmlFor="position" value="Position" aria-required />
                    <Select
                        name="position"
                        value={data.position}
                        onValueChange={(value) => setData("position", value)}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Position" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(positions).length > 0 &&
                                Object.entries(positions).map(([key, value]) => (
                                    <SelectGroup key={key}>
                                        {value.split(',').map((position) => (
                                            <SelectItem key={position} value={position}>{position}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.position} />
                </div>,
                <div key="department_id">
                    <InputLabel htmlFor="department_id" value="Department ID" aria-required />
                    <AutoCompleteSelect
                        label="Select Department"
                        value={
                            data.department_id?.toString() ?? null
                        }
                        setValue={(value: string) => {
                            setData(
                                "department_id",
                                Number(value) ?? null
                            );
                        }}
                        values={
                            Departments
                        }
                        isError={Boolean(errors.department_id)}
                    />
                    <InputError message={errors.department_id} />
                </div>,
                <div key="date_of_joining_in_this_college">
                    <InputLabel htmlFor="date_of_joining_in_this_college" value="Date of Joining in This College" />
                    <DatePicker
                        className={"w-full"}
                        id="date_of_joining_in_this_college"
                        value={data.date_of_joining_in_this_college}
                        onChange={(date) => setData("date_of_joining_in_this_college", getStringDate(date))}
                        isError={Boolean(errors.date_of_joining_in_this_college)}
                    />
                    <InputError message={errors.date_of_joining_in_this_college} />
                </div>,
                <div key="date_of_joining_govt_service">
                    <InputLabel htmlFor="date_of_joining_govt_service" value="Date of Joining Govt Service" />
                    <DatePicker
                        className={"w-full"}
                        id="date_of_joining_govt_service"
                        value={data.date_of_joining_govt_service}
                        onChange={(date) => setData("date_of_joining_in_this_college", getStringDate(date))}
                        isError={Boolean(errors.date_of_joining_govt_service)}
                    />
                    <InputError message={errors.date_of_joining_govt_service} />
                </div>,
                <div key="date_of_joining_current_rank">
                    <InputLabel htmlFor="date_of_joining_current_rank" value="Date of Joining Current Rank" />
                    <DatePicker
                        className={"w-full"}
                        id="date_of_joining_current_rank"
                        value={data.date_of_joining_current_rank}
                        onChange={(date) => setData("date_of_joining_in_this_college", getStringDate(date))}
                        isError={Boolean(errors.date_of_joining_current_rank)}
                    />
                    <InputError message={errors.date_of_joining_current_rank} />
                </div>,
                <div key="seniority_number">
                    <InputLabel htmlFor="seniority_number" value="Seniority Number" />
                    <Input
                        className={"w-full"}
                        id="seniority_number"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="i.e 0"
                        value={data.seniority_number}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setData("seniority_number", Number(value));
                        }}
                    />
                    <InputError message={errors.seniority_number} />
                </div>
            ]
        },
        {
            title: "Status",
            fields: [
                <div key="status" className="grid grid-cols-2 gap-4">
                    <div className="items-top flex items-center space-x-2">
                        <Checkbox
                            id="isvisiting"
                            name="isvisiting"
                            checked={data.isvisiting}
                            onCheckedChange={(checked) =>
                                setData("isvisiting", Boolean(checked))
                            }
                        />
                        <Label htmlFor="isvisiting" className="text-sm font-medium leading-none">
                            Is Visiting
                        </Label>
                    </div>
                    <div className="items-top flex items-center space-x-2">
                        <Checkbox
                            id="is_active"
                            name="is_active"
                            checked={data.is_active === 'active'}
                            onCheckedChange={(checked) =>
                                setData("is_active", checked ? 'active' : 'inactive')
                            }
                        />
                        <Label htmlFor="is_active" className="text-sm font-medium leading-none">
                            Is Active
                        </Label>
                    </div>
                </div>
            ]
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const method = isEditing ? put : post;
        const url = isEditing ? route("teachers.update", initialData?.id) : route("teachers.store");

        method(url, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => router.get(route("teachers.index")),
            onError: (error) => {
                if (error.message) {
                    toast.error(error.message);
                }
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="w-full bg-white rounded-lg dark:bg-background">
                <CardHeader>
                    <CardTitle>
                        {isEditing ? "Edit Teacher" : "Create Teacher"}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {formSections.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">
                                {section.title}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {section.fields}
                            </div>
                        </div>
                    ))}
                </CardContent>

                <CardFooter className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.get(route("teachers.index"))}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {isEditing ? "Update" : "Save"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}

export default TeacherForm;