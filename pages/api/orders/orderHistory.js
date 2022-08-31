import { getSession } from "next-auth/react"
import Order from "../../../models/Order"
import db from "../../../utils/db"

const handler = async ( req, res ) => {
    const session = await getSession({ req })
    if(!session){
        return res.status(401).send({ message: "Login Required"})
    }

    const { user } = session
    await db.connect()
    const orderHistory = await Order.find({user: user._id})
    await db.disconnect()
    res.send(orderHistory)
}

export default handler