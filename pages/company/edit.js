import React, { useContext, useEffect } from 'react'
import Router from 'next/router';
import CompanyContext from '../../store/company-context'
import { useSession, getSession } from 'next-auth/client';
import classes from "./edit.module.css";
import { PrismaClient } from "@prisma/client";
import About from '../../components/forms/company/about';
import Additional from '../../components/forms/company/additional';
import Parking from '../../components/forms/company/parking';
import Sidebar from '../../components/profile/sidebar';

function Edit({ company }) {
    useEffect(() => {
        const { name, mcnumber, usdot, phone, website, city, state, zip, dispatch24, insurance, deposit } = company
        const about = {
            name,
            mcnumber,
            usdot,
            phone,
            website,
            city,
            state,
            zip
        }
        const additional = {
            dispatch24,
            insurance,
            deposit
        }
        setAbout(about)
        setAdditional(additional)
        if (company.parking !== parking) {
            setParking(company.parking)
        }
    }, [])
    const [session] = useSession()

    const companyCtx = useContext(CompanyContext)
    const { setParking, parking, setAbout, about, setAdditional, additional } = companyCtx

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const id = session.user.companyId
            const body = { about, parking, additional, id };
            await fetch("/api/company/edit", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            await Router.push('/');
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className={classes.main}>
            {/* <ProfilePassword /> */}

            <div>
                <form onSubmit={handleSubmit}>
                    <h3>О компании</h3>
                    <div><About /></div>
                    <h3>Дополнительная Информация</h3>
                    <Additional />
                    <h3>Парковочные Места</h3>
                    <div><Parking /></div>
                    <button type="submit">Сохранить</button>
                </form>
            </div>
            <Sidebar />

        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });
    const prisma = new PrismaClient();

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        if (session.user.companyId) {
            const company = await prisma.company.findUnique({
                where: {
                    id: session.user.companyId
                },
            })

            return {
                props: { session, company },

            }
        }
    }


}

export default Edit;