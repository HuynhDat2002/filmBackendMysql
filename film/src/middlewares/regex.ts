'use strict'
export const emailRegex =  /^[a-zA-Z][\w]+@([\w-]+\.)+[\w]{1,4}$/g;

export const passwordRegex= /^(?=.*[A-Z])(?=.*[@#&*])[A-Za-z\d@#&*]{8,32}$/g

export const nameRegex = /^[a-zA-Z\s]*$/g

export const idRegex = /^[\da-z\-]*$/g

export const accessRegex = /^[a-zA-Z\d._-]*$/g

export const pageRegex = /^[\d]*$/g

export const queryRegex = /^[\d\w%\s]*$/g