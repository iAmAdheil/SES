import Router from 'express';
import User from '../models/user';
import { generateToken } from '../utils/token';

const router = Router();

router.post('/signin', async (req, res, next) => {
    try {
        const { id } = req.body;

        const user = await User.findOne({ id });

        if (!user) {
            try {
                const newUser = new User({ id });
                await newUser.save();
            } catch (error) {
                res.status(500).json({
                    message: 'User creation failed',
                });
                return;
            }
        }

        const token = generateToken(id);
        if (!token) {
            throw new Error('Token generation failed');
        }

        res.status(200).json({
            message: 'User found',
            token,
        });
    } catch (error) {
        res.status(500).json({
            message:
                error instanceof Error ? error.message : 'Something went wrong',
        });
    }
});

export default router;
