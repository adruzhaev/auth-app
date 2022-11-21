import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import { ApiRoutes, AppRoutes } from '../constants/route';
import { StatusCode } from '../constants/status-code';
import { useRouter } from 'next/router';
import { Header } from '../components/Header';
import { MockContent } from '../components/MockContent';
import styles from '../styles/Home.module.css';

export default function Home() {    
    const router = useRouter();
    
    const handleLogoutButtonClick = async () => {
        const response = await axios.post(ApiRoutes.SignOut);

        if (response.status === StatusCode.OK) {
            router.push(AppRoutes.SignIn);
        }
    };

    return <div className={styles.container}>
        <Header onLogoutButtonClick={handleLogoutButtonClick} />

        <div className={styles.content}>
            <MockContent />
            <MockContent />
            <MockContent />
            <MockContent />
        </div>
    </div>;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { token } = parse(req.headers.cookie || '');

    if (!token) {
        return {
            redirect: {
                destination: AppRoutes.SignIn,
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};