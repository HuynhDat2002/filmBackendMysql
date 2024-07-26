'use strict'
export const emailRegex =  /^[\w-\.]+@([\w-]+\.)+[\w-]{1,4}$/g;
// export const passwordRegex =  new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
export const passwordRegex= /^(?=.*[A-Z])(?=.*[@#&*])[A-Za-z\d@#&*]{8,32}$/g

export const nameRegex = /^[a-zA-Z\s]*$/g

export const idRegex = /^[\da-z]*$/g


export const accessRegex = /^[a-zA-Z\d._-]*$/g

export const pageRegex = /^[\d]*$/g

export const queryRegex = /^[\d\w%\s]*$/g