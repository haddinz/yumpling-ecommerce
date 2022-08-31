import { getSession } from "next-auth/react"
import User from "../../../../models/User"
import db from "../../../../utils/db"


const handler = async (req, res) => {
    const session = await getSession({ req })
    if(!session || (session && !session.user.isAdmin)){
        return res.status(400).send({ message: "Signin Admin Required "})
    }

    if(req.method === "DELETE"){
        return deleteHandler(req, res)
    } else {
        return res.status(400).send({ message: "method not allowed"})
    }
}

const deleteHandler = async (req,res) => {
    await db.connect()
    const user = await User.findById(req.query.id)
    if(user){
        if(user.email === "admin@gmail.com"){
            res.status(400).send({ message: 'System Rejected Delete Admin '})
        }
        await user.remove()
        await db.disconnect()
        res.send({ message: "User Successfully Deleted "})
    } else {
        await db.disconnect()
        res.status(400).send({ message: "User Not Found "})
    }
}

export default handler