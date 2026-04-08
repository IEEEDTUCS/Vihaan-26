import mongoose from "mongoose";
import dotenv from "dotenv";
import { Room } from "../models/room.model";

dotenv.config();

const roomsData = [
    { room: "104", availability: 50 },
    { room: "105", availability: 50 },
    { room: "116", availability: 50 },
    { room: "201", availability: 70 },
    { room: "204", availability: 30 },
    { room: "203", availability: 50 },
    { room: "205", availability: 50 },
    { room: "301", availability: 30 },
    { room: "303", availability: 30 },
    { room: "304", availability: 30 },
    { room: "315", availability: 30 },
    { room: "316", availability: 30 },
];

const seedRooms = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("✅ DB Connected");

        // optional: clear existing rooms
        await Room.deleteMany({});
        console.log("🧹 Existing rooms cleared");

        await Room.insertMany(
            roomsData.map((r) => ({
                room_number: r.room,
                availability: r.availability,
            }))
        );

        console.log("🚀 Rooms seeded successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding rooms:", error);
        process.exit(1);
    }
};

seedRooms();