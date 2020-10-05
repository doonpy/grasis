import withAuth from '../../hooks/withAuth';
import Main from '../../layouts/Main';

function Index() {
  return <div>Index neè</div>;
}

Index.layout = Main;

Index.getInitialProps = async (ctx) => {
  return { title: 'Khóa luận', selectedMenu: '1' };
};

export default withAuth(Index);
