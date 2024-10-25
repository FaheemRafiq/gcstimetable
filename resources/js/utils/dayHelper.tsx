type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

let dayCardClasses: { 
    background: Record<DayOfWeek, string>, 
    border: Record<DayOfWeek, string>, 
    shadow: Record<DayOfWeek, string> 
} = {
    background: {
        monday: "bg-card-monday text-card-monday-foreground",
        tuesday: "bg-card-tuesday text-card-tuesday-foreground",
        wednesday: "bg-card-wednesday text-card-wednesday-foreground",
        thursday: "bg-card-thursday text-card-thursday-foreground",
        friday: "bg-card-friday text-card-friday-foreground",
        saturday: "bg-card-saturday text-card-saturday-foreground",
        sunday: "bg-card-sunday text-card-sunday-foreground",
    },
    border: {
        monday: "border-card-monday",
        tuesday: "border-card-tuesday",
        wednesday: "border-card-wednesday",
        thursday: "border-card-thursday",
        friday: "border-card-friday",
        saturday: "border-card-saturday",
        sunday: "border-card-sunday",
    },
    shadow: {
        monday: "shadow-card-monday",
        tuesday: "shadow-card-tuesday",
        wednesday: "shadow-card-wednesday",
        thursday: "shadow-card-thursday",
        friday: "shadow-card-friday",
        saturday: "shadow-card-saturday",
        sunday: "shadow-card-sunday",
    },
}

function getBackgroundColor(dayName: string) {
    const day = dayName.toLowerCase() as DayOfWeek;
    return dayCardClasses.background[day] ?? dayCardClasses.background.monday;
}

function getBorderColor(dayName: string) {
    const day = dayName.toLowerCase() as DayOfWeek;
    return dayCardClasses.border[day] ?? dayCardClasses.border.monday;
}

function getShadowColor(dayName: string) {
    const day = dayName.toLowerCase() as DayOfWeek;
    return dayCardClasses.shadow[day] ?? dayCardClasses.shadow.monday;
}

export { getBackgroundColor, getBorderColor, getShadowColor, dayCardClasses, type DayOfWeek };
