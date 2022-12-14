import { getSession } from "next-auth/react"
import Order from "../../../../models/Order"
import db from "../../../../utils/db"

const handler = async ( req, res ) => {
    const session = getSession( req )
    if(!session){
        return res.status(401).send('Login required')
    }

    await db.connect()
    const order = await Order.findById(req.query.id)
    if(order){
        if(order.isPaid){
            return res.status(400).send({ message: 'Order Already Paid'})
        }
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            emailAddress: req.body.emailAddress
        }
        const paidOrder = await order.save()
        await db.disconnect()
        res.send({ message: "order paid successfully", order: paidOrder})
    } else {
        await db.disconnect()
        res.status(401).send({ message: "Order Not Found"})
    }
}

export default handler