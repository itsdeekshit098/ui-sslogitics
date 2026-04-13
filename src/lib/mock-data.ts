export const mockVehicles = [
    {
        id: 1,
        vehicle_number: "AP 02 AB 1234",
        vehicle_type: "Bus",
        capacity: "40 Seater",
        company: "Tata",
        model: "Starbus",
        status: "Active",
        last_service_date: "2023-12-15",
    },
    {
        id: 2,
        vehicle_number: "AP 02 CD 5678",
        vehicle_type: "Car",
        capacity: "4 Seater",
        company: "Toyota",
        model: "Innova",
        status: "Active",
        last_service_date: "2023-12-20",
    },
    {
        id: 3,
        vehicle_number: "AP 02 EF 9012",
        vehicle_type: "Tempo Traveller",
        capacity: "12 Seater",
        company: "Force",
        model: "Traveller",
        status: "Maintenance",
        last_service_date: "2024-01-05",
    },
    {
        id: 4,
        vehicle_number: "AP 02 GH 3456",
        vehicle_type: "Truck",
        capacity: "10 Ton",
        company: "Ashok",
        model: "Leyland",
        status: "Idle",
        last_service_date: "2023-11-30",
    },
];

export const mockDieselRecords = [
    {
        id: 1,
        date: "2024-01-08",
        time: "10:30",
        driver: "Raju",
        currentOdometer: 15000,
        fuelAdded: 45.5,
        pricePerL: 100,
        amount: 4550,
        previousOdometer: 14800,
        distance: 200,
        consumption: 4.4,
        expectedKmL: 4.5,
        deviation: -2.2,
        station: "Indian Oil",
        verifiedBy: "Admin",
        discrepancy: false,
        vehicle: { id: 1 }
    }
];
