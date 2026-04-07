import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateAdminToken = (id: string, role: string): string => {
    return jwt.sign({ id, role, type: "admin" }, JWT_SECRET, { expiresIn: "12h" });
};

export const generateUserToken = (id: string, teamId: string, role: string): string => {
    return jwt.sign({ id, teamId, role, type: "user" }, JWT_SECRET, { expiresIn: "12h" });
};
