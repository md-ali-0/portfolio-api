import express from 'express';
import { AboutMeRoutes } from '../modules/AboutMe/aboutMe.route';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { CategoryRoutes } from '../modules/Category/category.route';
import { ExperienceRoutes } from '../modules/Experience/experience.route';
import { PostRoutes } from '../modules/Posts/post.route';
import { ProjectRoutes } from '../modules/Project/project.route';
import { SkillRoutes } from '../modules/Skill/skill.route';
import { userRoutes } from '../modules/User/user.routes';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/category',
        route: CategoryRoutes
    },
    {
        path: '/post',
        route: PostRoutes
    },
    {
        path: '/project',
        route: ProjectRoutes
    },
    {
        path: '/experience',
        route: ExperienceRoutes
    },
    {
        path: '/skill',
        route: SkillRoutes
    },
    {
        path: '/about',
        route: AboutMeRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;