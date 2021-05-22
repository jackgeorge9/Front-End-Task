import React, { FC } from 'react';
import { Button } from "react-bootstrap";

interface DeleteBtnProps {
    onDelete: any
}

export const DeleteBtn: FC<DeleteBtnProps> = ({ onDelete }) => {
    return (
        <Button variant="danger" onClick={onDelete}>Delete</Button>
    );
};



