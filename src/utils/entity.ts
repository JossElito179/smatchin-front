export type itemOwner = {
    id: number,
    name: string,
    first_name: string,
    phone_number: string,
    email: string,
    user_name: string,
    team: string,
    profil_img?: string,
}

export type itemTeam = {
    id: number
    name: string,
    logo: string,
    id_owner: number,
    owner: string,
    is_male: boolean,
    total_members: number
}

export type itemPlayer = {
    id: number,
    name: string,   
    first_name: string,
    birth_date: string,
    role: string,
    number: number,
    profil_img?: string,
}