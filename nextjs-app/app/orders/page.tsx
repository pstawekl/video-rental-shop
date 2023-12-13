'use client'
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { Order } from "../../utils/orderUtils";
import Loading from "../../components/Loading";
import { Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function OrdersPage() {
    const router = useRouter();
    const { user, isLoading } = useUser();
    const [orderList, setOrderList] = useState<Order[]>();

    useEffect(() => {
        if (user) {
            fetch('/api/mssql/orders/get-user-orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.sub })
            })
                .then(response => response.json())
                .then(data => {
                    const orderList: Order[] = data.orders;
                    console.log(orderList);
                    setOrderList(orderList);
                })
                .catch(error => console.error('Error:', error))
            console.log('orderList', orderList)
        }
    }, [user])

    const date: Date = new Date();

    function formatDate(date: Date) {
        const rok = date.getFullYear();
        const miesiac = String(date.getMonth() + 1).padStart(2, '0');
        const dzien = String(date.getDate()).padStart(2, '0');
        return `${rok}-${miesiac}-${dzien}`;
    }
    const todayDate = formatDate(date);

    if (!isLoading && orderList) {
        return (
            <>
                <Row>
                    <Col xs="1">
                        <FontAwesomeIcon icon={faArrowLeft} onClick={() => router.back()} style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
                    </Col>
                    <Col>
                        <h3>Twoje zamówienia</h3>
                    </Col>
                </Row>
                <Row style={{ background: 'gray', color: 'white', border: '1px solid black' }}>
                    <Col>Nazwa Filmu</Col>
                    <Col>Data Wypożyczenia</Col>
                    <Col>Data zwrotu</Col>
                    <Col>Czy zwrócono?</Col>
                </Row>
                {orderList.map((order: Order) => {
                    const formattedDate = order.or_return_date.split('T')[0].replace(/-/g, '');
                    const todayYear = parseInt(todayDate.substring(0, 4), 10);
                    const todayMonth = parseInt(todayDate.substring(4, 6), 10) - 1;
                    const todayDay = parseInt(todayDate.substring(6, 8), 10);

                    const orderReturnYear = parseInt(formattedDate.substring(0, 4), 10);
                    const orderReturnMonth = parseInt(formattedDate.substring(4, 6), 10) - 1;
                    const orderReturnDay = parseInt(formattedDate.substring(6, 8), 10);

                    const today = new Date(todayYear, todayMonth, todayDay);
                    const orderReturnDate = new Date(orderReturnYear, orderReturnMonth, orderReturnDay);
                    let style = { background: 'white', color: "black" };
                    if (!order.is_returned || orderReturnDate < today) {
                        style = { background: 'red', color: "white" }
                    } else {
                        style = { background: 'lightgreen', color: "white" }
                    }
                    return (
                        <Link href={'/orders/order-'+order.or_id} style={{textDecoration: 'none', color: 'black'}}>
                            <Row className="order-row">
                                <Col className="border border-dark">{order.vt_name}</Col>
                                <Col className="border border-dark">{order.or_start_date}</Col>
                                <Col className="border border-dark">{order.or_return_date}</Col>
                                <Col className="border border-dark" style={style}>{order.is_returned ? 'Tak' : 'Nie'}</Col>
                            </Row>
                        </Link>
                    )
                })}
            </>
        )
    } else {
        return <Loading />
    }
}