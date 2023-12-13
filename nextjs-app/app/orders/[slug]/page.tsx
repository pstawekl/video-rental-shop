'use client'

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { Order } from "../../../utils/orderUtils";
import Loading from "../../../components/Loading";
import { Button, Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClose } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function OrderPage({ params }) {
    const router = useRouter();
    const { user, isLoading } = useUser();
    const [order, setOrder] = useState<Order>();
    const [isReturned, setIsReturned] = useState<boolean>(false);
    const [isAfterReturn, setIsAfterReturn] = useState<boolean>(false);
    const orderId: string = params.slug.split('-')[1];

    useEffect(() => {
        if (user) {
            fetch('/api/mssql/orders/get-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId: orderId })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    const order: Order = data.order[0];
                    setOrder(order);
                })
                .catch(error => console.error('Error:', error))
        }
    }, [])

    useEffect(() => {
        if (order) {
            setIsReturned(order.is_returned);
        }
    }, [order])

    function handleReturnOrder() {
        if (!isReturned) {
            fetch('/api/mssql/orders/return-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId: orderId })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setIsReturned(true);
                    setIsAfterReturn(true);
                })
                .catch(error => console.error('Error:', error))
        }
    }

    if (!isLoading && order) {
        return (
            <>
                {
                    isAfterReturn && isReturned && <OrderReturnedMessage />
                }
                <Row className="mb-5">
                    <Col xs="1">
                        <FontAwesomeIcon icon={faArrowLeft} onClick={() => router.back()} style={{ fontSize: '2rem', cursor: 'pointer' }} />
                    </Col>
                    <Col><h3>{order.vt_name}</h3></Col>
                </Row>
                <Row>
                    <Col>
                        <Row>
                            <Col style={{ textAlign: "right" }}>Zamówienie nr:</Col>
                            <Col>{order.or_id}</Col>
                        </Row>
                        <Row>
                            <Col style={{ textAlign: "right" }}>Nazwa filmu:</Col>
                            <Col>{order.vt_name}</Col>
                        </Row>
                        <Row>
                            <Col style={{ textAlign: "right" }}>Wypożyczono dnia:</Col>
                            <Col>{order.or_start_date}</Col>
                        </Row>
                        <Row>
                            <Col style={{ textAlign: "right" }}>Wypożyczono do:</Col>
                            <Col>{order.or_return_date}</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col style={{ textAlign: "right" }}>Status:</Col>
                            <Col>{isReturned ? "Zwrócono" : "Nie zwrócono"}</Col>
                        </Row>
                        <Row className="my-5">
                            <Col></Col>
                            <Col>
                                <Button disabled={isReturned} onClick={handleReturnOrder}>{isReturned ? "Zwrócono" : "Zwróć"}</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        )
    } else {
        <Loading />
    }
}

function OrderReturnedMessage() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    if (isOpen) {
        return (
            <Row style={{background: 'lightgreen', color: 'white'}}>
                <Col></Col>
                <Col>
                    <h3>Zwrócono zamówienie</h3>
                </Col>
                <Col>
                    <FontAwesomeIcon icon={faClose} onClick={() => setIsOpen(false)} style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
                </Col>
            </Row>
        )
    }
}