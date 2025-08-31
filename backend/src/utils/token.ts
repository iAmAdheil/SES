import jwt from 'jsonwebtoken';

export const generateToken: (id: string) => string | null = (id: string) => {
    try {
        const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });

        return token;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const verifyToken: (token: string) => { id: string } | null = (
    token: string
) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return decoded as { id: string };
    } catch (error) {
        console.log(error);
        return null;
    }
};
