import { getSession } from "next-auth/react"
import User from "../../../../models/User"
import db from "../../../../utils/db"


const handler = async (req, res) => {
    const session = await getSession({ req })
    if(!session || (session && !session.user.isAdmin)){
        return res.status(400).send({ message: "Admin Signin Required "})
    }

    await db.connect()
    const user = await User.find({})
    await db.disconnect()
    res.send(user)
}

export default handler