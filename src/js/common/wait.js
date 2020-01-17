const { $id } = require('../utils');

exports.Wait = {
    open() {
        $id('wait').style.display = 'flex';
        setTimeout(() => {
            $id('wait-content').style.opacity = '1';
            $id('wait-content').style.transform = 'translateY(0px)';
        }, 50);
    },

    close() {
        $id('wait').style.display = 'none';
        $id('wait-content').style.opacity = '0';
        $id('wait-content').style.transform = 'translateY(-20px)';
    }
};
