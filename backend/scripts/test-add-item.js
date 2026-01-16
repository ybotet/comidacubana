const { sequelize, Cart } = require('../src/shared/database/models');
const Dish = require('../src/modules/dishes/models/Dish');

(async () => {
    try {
        await sequelize.authenticate();
        const sessionId = process.argv[2] || '6fec315c-fb85-4d9b-8c10-db08c5553703';
        const cart = await Cart.findOne({ where: { session_id: sessionId } });
        console.log('Before, items=', cart.items);
        const item = { dish_id: '2d285aad-ac7c-4324-a438-ba614ad43b7b', quantity: 2 };
        await cart.addItem(item);
        console.log('After addItem (in-memory), items=', cart.items);
        console.log('Changed fields before save:', cart.changed());
        await cart.save();
        console.log('After save, items=', cart.items);
        console.log('Changed fields after save:', cart.changed());
        const fresh = await Cart.findOne({ where: { session_id: sessionId } });
        console.log('Reloaded from DB, items=', fresh.items);
        await sequelize.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
