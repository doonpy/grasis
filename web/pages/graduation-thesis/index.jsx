import withAuth from '../../hooks/withAuth';
import Admin from '../../layouts/Admin';

function Index() {
  return <div>Index neè</div>;
}

Index.layout = Admin;

Index.getInitialProps = async () => {
  return {
    title: 'Khóa luận',
    breadCrumb: [{ name: 'Khóa luận', path: '/graduation-thesis' }]
  };
};

export default withAuth(Index);
