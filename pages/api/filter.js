import { getSession } from "next-auth/react";
import Product from "../../models/Product";
import db from "../../utils/db";

const handler = async (req, res) => {
    const session = await getSession({ req })
    if(!session){
        return res.status(400).send({ message: 'Login Required'})
    }

    await db.connect()
    const product = await Product.find({})
    await db.disconnect()
    res.send(product)
}

export default handler