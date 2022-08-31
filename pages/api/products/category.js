import { getSession } from "next-auth/react"
import Product from "../../../models/Product"
import db from "../../../utils/db"


const handler = async ( req, res ) => {
    const session = getSession({ req })
    if(!session){
        return res.status(400).send("Login Required")
    }

    db.connect()
    const categories = await Product.find().distinct('category')
    db.disconnect()
    res.send(categories)
}

export default handler